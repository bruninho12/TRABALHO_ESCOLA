import { useQuery, useMutation, useQueryClient } from "react-query";
import { categoryService } from "../services/api";

export function useCategories() {
  const queryClient = useQueryClient();

  const categories = useQuery("categories", () =>
    categoryService
      .getAll()
      .then((res) => {
        // Garantir que sempre retorna um array
        const data =
          res.data?.data?.categories ||
          res.data?.categories ||
          res.data?.data ||
          res.data ||
          [];
        return Array.isArray(data) ? data : [];
      })
      .catch(() => [])
  );

  const createCategory = useMutation(
    (newCategory) => categoryService.create(newCategory),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  const updateCategory = useMutation(
    ({ id, category }) => categoryService.update(id, category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  const deleteCategory = useMutation((id) => categoryService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  return {
    categories: Array.isArray(categories.data) ? categories.data : [],
    isLoading: categories.isLoading,
    error: categories.error,
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    deleteCategory: deleteCategory.mutate,
  };
}
