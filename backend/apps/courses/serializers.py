"""
Serializers para gestión de cursos Scout
Sistema de Gestión Integral de Cursos Scout
"""

from rest_framework import serializers
from .models import Course, Category, CourseTeam


class CategorySerializer(serializers.ModelSerializer):
    """Serializer para categorías de cursos"""

    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "description", "is_active", "courses_count"]

    def get_courses_count(self, obj):
        """Número de cursos activos en esta categoría"""
        return obj.courses.filter(status=Course.ACTIVE).count()


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listas de cursos"""

    category_name = serializers.CharField(source="category.name", read_only=True)
    available_slots = serializers.SerializerMethodField()
    is_enrollment_open = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "code",
            "category_name",
            "rama",
            "status",
            "price",
            "max_participants",
            "available_slots",
            "start_date",
            "end_date",
            "is_enrollment_open",
        ]

    def get_available_slots(self, obj):
        """Cupos disponibles en el curso"""
        return obj.available_slots

    def get_is_enrollment_open(self, obj):
        """Si las inscripciones están abiertas"""
        return obj.is_enrollment_open


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalles de curso"""

    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    available_slots = serializers.SerializerMethodField()
    is_enrollment_open = serializers.SerializerMethodField()
    team_members = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "code",
            "category",
            "category_id",
            "rama",
            "status",
            "price",
            "max_participants",
            "available_slots",
            "start_date",
            "end_date",
            "is_enrollment_open",
            "team_members",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "created_by"]

    def get_available_slots(self, obj):
        return obj.available_slots

    def get_is_enrollment_open(self, obj):
        return obj.is_enrollment_open

    def get_team_members(self, obj):
        """Miembros del equipo del curso"""
        team_members = obj.team.select_related("user").all()
        return [
            {
                "id": member.id,
                "user_name": member.user.get_full_name() or member.user.username,
                "role": member.get_role_display(),
                "assigned_at": member.assigned_at,
            }
            for member in team_members
        ]

    def validate(self, data):
        """Validaciones del curso"""
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "La fecha de fin debe ser posterior a la fecha de inicio"}
            )
        return data


# Alias para compatibilidad
CourseSerializer = CourseDetailSerializer


class CourseTeamSerializer(serializers.ModelSerializer):
    """
    Serializer para equipo del curso
    """

    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = CourseTeam
        fields = [
            "id",
            "course",
            "course_title",
            "user",
            "user_name",
            "user_email",
            "role",
            "role_display",
            "assigned_at",
        ]
        read_only_fields = ["id", "assigned_at"]

    def validate(self, data):
        """Validar que no exista la misma combinación curso-usuario-rol"""
        course = data.get("course")
        user = data.get("user")
        role = data.get("role")

        if CourseTeam.objects.filter(course=course, user=user, role=role).exists():
            raise serializers.ValidationError(
                "Este usuario ya tiene este rol asignado en el curso"
            )
        return data
