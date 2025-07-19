# Copilot Instructions for React Native Applications

This document provides default rules and best practices for using GitHub Copilot in React Native projects.

## General Rules

- **Use only React Native components** (`View`, `Text`, `Image`, etc.) for cross-platform compatibility.
- **Avoid web-only components** (e.g., `div`, `span`, `img`) and browser APIs.
- **Prefer Expo managed workflow** for easier setup and updates, unless you need custom native code.
- **Use TypeScript** for type safety and better Copilot suggestions.
- **Keep business logic and UI components separate** for maintainability.
- **Use hooks** (`useState`, `useEffect`, etc.) for state and lifecycle management.
- **Leverage community libraries** that are actively maintained and compatible with React Native (e.g., `react-navigation`, `expo-image-picker`).
- **Always validate user input** and handle errors gracefully.
- **Use StyleSheet for styles** instead of inline styles for better performance.
- **Test on both iOS and Android** to ensure cross-platform compatibility.

## File and Folder Structure

- Place screens in the `app/` directory.
- Place reusable components in the `components/` directory.
- Place utility functions in the `utils/` directory.
- Place services (API, storage, etc.) in the `services/` directory.
- Use `assets/` for images, fonts, and other static resources.

## Coding Conventions

- Use functional components and hooks.
- Use PascalCase for component and file names.
- Use camelCase for variables and functions.
- Keep components small and focused.
- Prefer destructuring props and state.
- Use `export default` for screens, and named exports for reusable components.
- Document complex logic with comments and JSDoc.

## Dependency Management

- Remove unused dependencies regularly.
- Use `expo install` for Expo-compatible packages.
- Avoid using packages that require custom native code unless necessary.
- Keep dependencies up to date.

## Error Handling

- Use try/catch for async operations.
- Show user-friendly error messages (e.g., with Toasts or Alerts).
- Log errors for debugging, but avoid exposing sensitive info.

## Performance

- Use `React.memo` and `useCallback` to optimize re-renders.
- Avoid unnecessary state in parent components.
- Use FlatList/SectionList for large lists.
- Optimize images (size, format) for mobile.

## Accessibility

- Use accessible components and props (e.g., `accessibilityLabel`).
- Ensure touch targets are large enough.
- Test with screen readers when possible.

## Testing

- Write unit tests for utilities and business logic.
- Use Jest and React Native Testing Library for component tests.
- Test navigation and user flows.

---

_These rules help ensure your React Native project is robust, maintainable, and compatible with GitHub Copilot's suggestions._
