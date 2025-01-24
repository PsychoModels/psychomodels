export const draftSliceSerializeFns = new Set<() => void>();

export const serializeAllDraftSlices = () => {
  return [...draftSliceSerializeFns].reduce((acc, serializeFn: () => any) => {
    const sliceData = serializeFn();
    return { ...acc, ...sliceData };
  }, {});
};
