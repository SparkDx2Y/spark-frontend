import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

//? Instead of using plain useDispatch and useSelector we use the hooks we created.its helpful for instead of importing RootState and AppDispatch every time for useSelector and useDispatch.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
