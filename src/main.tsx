import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { apply_store_theme } from './config/apply_theme.ts';
import { store } from './config/store.ts';
import { CartProvider } from './context/cart_context.tsx';
import { AppRouter } from './router/app_router.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/bespoke.css';

apply_store_theme(store);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
