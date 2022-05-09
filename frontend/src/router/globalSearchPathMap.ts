import { AppGalleryItemType } from '../@types';

export const getSearchPathFromGalleryItem = (payload: AppGalleryItemType) => {
  const map = [
    {
      type: 'user',
      path: `/user/${payload.$id}`,
    },
    {
      type: 'recipe',
      path: `/recipe/${payload.$id}`,
    },
    {
      type: 'ingredient',
      path: `/recipe/ingredient/${payload.$id}`,
    },
    {
      type: 'category',
      path: `/recipe/category/${payload.$id}`,
    },
  ];
  return map.find(({ type }) => type === payload.type)?.path || '/error';
};
