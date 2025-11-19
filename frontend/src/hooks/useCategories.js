import { useQuery, useMutation, useQueryClient } from "react-query";
import { categoryService } from "../services/api";

// Mock data para desenvolvimento
const mockCategories = [
  { id: "food", name: "Alimentação", type: "expense", color: "#FF6384" },
  { id: "transport", name: "Transporte", type: "expense", color: "#36A2EB" },
  { id: "utilities", name: "Contas", type: "expense", color: "#FFCE56" },
  { id: "health", name: "Saúde", type: "expense", color: "#4BC0C0" },
  {
    id: "entertainment",
    name: "Entretenimento",
    type: "expense",
    color: "#9966FF",
  },
  { id: "salary", name: "Salário", type: "income", color: "#4CAF50" },
  { id: "freelance", name: "Freelance", type: "income", color: "#8BC34A" },
  { id: "investment", name: "Investimentos", type: "income", color: "#00BCD4" },
];

export function useCategories() {
  const queryClient = useQueryClient();

  const categories = useQuery("categories", () =>
    categoryService
      .getAll()
      .then((res) => {
        console.log("Resposta completa do getAll:", res);
        const categoryList = res?.data?.categories || [];
        console.log("Categorias extraídas:", categoryList);
        return Array.isArray(categoryList) ? categoryList : [];
      })
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        // Retorna mock data em caso de erro
        return mockCategories;
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
