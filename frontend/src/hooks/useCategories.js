import { useQuery, useMutation, useQueryClient } from "react-query";
import { categoryService } from "../services/api";

export function useCategories() {
  const queryClient = useQueryClient();

  const categories = useQuery("categories", () =>
    categoryService
      .getAll()
      .then((res) => {
        // categoryService.getAll() já retorna response.data
        // Estrutura: { status: "success", data: { categories: [...] } }
        console.log("Resposta completa do getAll:", res);

        const categoryList = res?.data?.categories || [];
        console.log("Categorias extraídas:", categoryList);

        return Array.isArray(categoryList) ? categoryList : [];
      })
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        return [];
      })
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
