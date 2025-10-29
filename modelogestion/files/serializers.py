from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = File
        fields = ['id', 'filename', 'file', 'type', 'size', 'uploaded_by', 'related_to', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'size', 'type', 'uploaded_at']