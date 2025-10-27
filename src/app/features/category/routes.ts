import { Routes } from '@angular/router';
import { CategoryPage } from './pages/category-page/category-page';
import { UpsertCategoryPage } from './pages/upsert-category-page/upsert-category-page';
import { categoryResolver } from './resolvers';

export default [
  {
    path: 'category',
    component: CategoryPage,
  },
  {
    path: 'category/create',
    component: UpsertCategoryPage,
  },
  {
    path: 'category/:id/update',
    component: UpsertCategoryPage,
    resolve: {
      category: categoryResolver,
    },
  },
] as Routes;
