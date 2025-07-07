import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  saveUserToDB,
  getUserFromDB,
  updateAddCategory,
  addNewTodo,
  getTodos,
  editTodo,
  updateTodo,
} from "../firebase/firestore";
import KEYS from "../constants";

// NOTE: Mutation funtion(Post method or change,update function)

export const useSaveUserToDB = () => {
  return useMutation({
    mutationFn: ({ uid, userObj }) => saveUserToDB(uid, userObj), //NOTE:This is async fn so, please call a "mutateAsync"
  });
};

export const useAddCategory = () => {
  const updateQueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, categoryList }) =>
      updateAddCategory(docId, categoryList),
    onSuccess: () => {
      updateQueryClient.invalidateQueries({
        queryKey: [KEYS.tanstackKeys.getUser],
      });
    },
  });
};

export const useAddTodo = () => {
  const addQueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, todoObj }) => addNewTodo(docId, todoObj),
    onSuccess: () => {
      addQueryClient.invalidateQueries({
        queryKey: [KEYS.tanstackKeys.todos],
      });
    },
  });
};

export const useEditTodo = () => {
  const addQueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, todos }) => editTodo(docId, todos),
    onSuccess: () => {
      addQueryClient.invalidateQueries({
        queryKey: [KEYS.tanstackKeys.todos],
      });
    },
  });
};

export const useUpdateTodo = () => {
  const addQueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, dataObj }) => updateTodo(docId, dataObj),
    onSuccess: () => {
      addQueryClient.invalidateQueries({
        queryKey: [KEYS.tanstackKeys.todos],
      });
    },
  });
};

// NOTE: Query function(getting or function)

export const useGetUser = (docId) => {
  return useQuery({
    queryKey: [KEYS.tanstackKeys.getUser],
    queryFn: () => getUserFromDB(docId),
  });
};

export const useGetTodos = (docId) => {
  return useQuery({
    queryKey: [KEYS.tanstackKeys.todos],
    queryFn: () => getTodos(docId),
  });
};
