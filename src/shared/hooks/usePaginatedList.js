import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook para manejar listas paginadas con CRUD
 * @param {Function} fetchFunction - Función para obtener datos (debe retornar {data, pagination})
 * @param {number} pageSize - Elementos por página (default: 10)
 */
export const usePaginatedList = (fetchFunction, pageSize = 10) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const loadItems = useCallback(async (...args) => {
    setLoading(true);
    try {
      const response = await fetchFunction(pagination.currentPage, pageSize, ...args);
      setItems(response?.data || []);
      setPagination({
        currentPage: response?.pagination?.currentPage || 1,
        totalPages: response?.pagination?.totalPages || 1,
        total: response?.pagination?.totalRecords || 0
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error al cargar datos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pageSize, fetchFunction]);

  const goToPage = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages))
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages)
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1)
    }));
  }, []);

  const resetPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  return {
    items,
    setItems,
    loading,
    pagination,
    setPagination,
    loadItems,
    goToPage,
    nextPage,
    prevPage,
    resetPage
  };
};
