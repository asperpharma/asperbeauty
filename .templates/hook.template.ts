/**
 * use[HookName] Custom Hook
 * 
 * @description Brief description of what this hook does
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useHookName(param);
 * ```
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Parameters for the use[HookName] hook
 */
interface UseHookNameParams {
  /**
   * Description of parameter
   */
  param1: string;
  
  /**
   * Optional parameter
   * @default false
   */
  param2?: boolean;
}

/**
 * Return type for the use[HookName] hook
 */
interface UseHookNameReturn {
  /**
   * The data returned by the hook
   */
  data: any;
  
  /**
   * Loading state
   */
  isLoading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Function to refetch data
   */
  refetch: () => void;
  
  /**
   * Function to update data
   */
  updateData: (newData: any) => void;
}

/**
 * Custom hook implementation
 */
export const useHookName = ({ 
  param1, 
  param2 = false 
}: UseHookNameParams): UseHookNameReturn => {
  // State
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch logic here
      // const response = await api.fetchData(param1);
      // setData(response);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData({ result: `Data for ${param1}` });
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [param1]);

  // Effect to fetch data on mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update data function
  const updateData = useCallback((newData: any) => {
    setData(newData);
  }, []);

  // Refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    updateData,
  };
};

// Example usage:
// const { data, isLoading, error, refetch } = useHookName({ 
//   param1: "value",
//   param2: true 
// });
