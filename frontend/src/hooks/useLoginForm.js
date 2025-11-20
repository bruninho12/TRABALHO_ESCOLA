import { useState, useCallback, useMemo } from "react";

export const useLoginForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validações memoizadas
  const validators = useMemo(
    () => ({
      email: (value) => {
        if (!value) return "E-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
        return null;
      },

      password: (value) => {
        if (!value) return "Senha é obrigatória";
        if (value.length < 6) return "Senha deve ter no mínimo 6 caracteres";
        return null;
      },
    }),
    []
  );

  // Calcular força da senha
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }, []);

  // Validar campo específico
  const validateField = useCallback(
    (name, value) => {
      const validator = validators[name];
      if (!validator) return true;

      const error = validator(value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // Atualizar força da senha se necessário
      if (name === "password") {
        setPasswordStrength(calculatePasswordStrength(value));
      }

      return !error;
    },
    [calculatePasswordStrength, validators]
  );

  // Atualizar campo
  const updateField = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      validateField(name, value);
    },
    [validateField]
  );

  // Validar formulário completo
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const error = validators[field](formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validators]);

  // Reset do formulário
  const resetForm = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
    setAttempts(0);
    setPasswordStrength(0);
  }, []);

  // Incrementar tentativas
  const incrementAttempts = useCallback(() => {
    setAttempts((prev) => prev + 1);
  }, []);

  // Limpar erros
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    // Estado
    formData,
    loading,
    errors,
    attempts,
    passwordStrength,

    // Ações
    setLoading,
    updateField,
    validateField,
    validateForm,
    resetForm,
    incrementAttempts,
    clearErrors,

    // Computed
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default useLoginForm;
