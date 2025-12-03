import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Modular components
import CourseStatCards from './CourseStatCards';
import CourseFilters from './CourseFilters';
import CourseTable from './CourseTable';
import CourseDeleteConfirmModal from './CourseDeleteConfirmModal';
import CourseCreateModal from './CourseCreateModal';
import CourseEditModal from './CourseEditModal';
import CourseViewModal from './CourseViewModal';

// Custom hook
import { useCourses } from '@/hooks/useCourses';

/**
 * Main Courses Component - Refactored to use modular components
 */
const Cursos = () => {
  const navigate = useNavigate();

  // Use custom hook for all state and operations
  const {
    courses,
    selectedCourse,
    courseData,
    showCreateForm,
    showEditForm,
    showViewModal,
    showDeleteModal,
    errors,
    filters,
    filteredCourses,
    setShowCreateForm,
    setShowEditForm,
    setShowViewModal,
    setShowDeleteModal,
    setFilters,
    setCourseData,
    handleInputChange,
    handleAddFecha,
    handleRemoveFecha,
    handleFechaChange,
    handleCreateCourse,
    handleEditCourse,
    handleUpdateCourse,
    handleViewCourse,
    handleDeleteCourse,
    confirmDeleteCourse,
    resetForm,
  } = useCourses();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <CourseStatCards courses={courses} />

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Cursos Disponibles ({filteredCourses.length} de {courses.length})
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Curso
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <CourseFilters filters={filters} setFilters={setFilters} />

        {/* Table */}
        <div className="p-6">
          <CourseTable
            courses={filteredCourses}
            onView={handleViewCourse}
            onEdit={handleEditCourse}
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <CourseDeleteConfirmModal
        isOpen={showDeleteModal}
        course={selectedCourse}
        onConfirm={confirmDeleteCourse}
        onCancel={() => setShowDeleteModal(false)}
      />

      <CourseCreateModal
        isOpen={showCreateForm}
        onClose={resetForm}
        courseData={courseData}
        handleInputChange={handleInputChange}
        handleCreateCourse={handleCreateCourse}
      />

      <CourseEditModal
        isOpen={showEditForm}
        onClose={resetForm}
        selectedCourse={selectedCourse}
        handleUpdateCourse={handleUpdateCourse}
      />

      <CourseViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};

export default Cursos;
