import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  aggregateFieldComments,
  type FieldCommentMap,
} from "./aggregateFieldComments";

type FieldReviewCommentsContextValue = {
  comments: FieldCommentMap;
  enabled: boolean;
  setComment: (fieldKey: string, label: string, comment: string) => void;
  clearComment: (fieldKey: string) => void;
  getComment: (fieldKey: string) => string;
  aggregate: (freeText?: string) => string;
  hasComments: boolean;
};

const FieldReviewCommentsContext =
  createContext<FieldReviewCommentsContextValue | null>(null);

export function FieldReviewCommentsProvider({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const [comments, setComments] = useState<FieldCommentMap>({});

  const setComment = useCallback(
    (fieldKey: string, label: string, comment: string) => {
      setComments((prev) => {
        const trimmed = comment.trim();
        if (!trimmed) {
          if (!(fieldKey in prev)) return prev;
          const next = { ...prev };
          delete next[fieldKey];
          return next;
        }
        return {
          ...prev,
          [fieldKey]: { label, comment: trimmed },
        };
      });
    },
    []
  );

  const clearComment = useCallback((fieldKey: string) => {
    setComments((prev) => {
      if (!(fieldKey in prev)) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  }, []);

  const getComment = useCallback(
    (fieldKey: string) => comments[fieldKey]?.comment ?? "",
    [comments]
  );

  const aggregate = useCallback(
    (freeText?: string) => aggregateFieldComments(comments, freeText),
    [comments]
  );

  const hasComments = useMemo(
    () => Object.values(comments).some((c) => c.comment?.trim()),
    [comments]
  );

  const value = useMemo(
    () => ({
      comments,
      enabled,
      setComment,
      clearComment,
      getComment,
      aggregate,
      hasComments,
    }),
    [
      comments,
      enabled,
      setComment,
      clearComment,
      getComment,
      aggregate,
      hasComments,
    ]
  );

  return (
    <FieldReviewCommentsContext.Provider value={value}>
      {children}
    </FieldReviewCommentsContext.Provider>
  );
}

export function useFieldReviewComments(): FieldReviewCommentsContextValue {
  const ctx = useContext(FieldReviewCommentsContext);
  if (!ctx) {
    return {
      comments: {},
      enabled: false,
      setComment: () => undefined,
      clearComment: () => undefined,
      getComment: () => "",
      aggregate: (freeText?: string) => freeText?.trim() ?? "",
      hasComments: false,
    };
  }
  return ctx;
}
