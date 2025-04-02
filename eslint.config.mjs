import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
    // Base configurations
    eslint.configs.recommended,

    // Global ignores - apply to all configurations
    {
        ignores: ['build/**', 'dist/**', 'node_modules/**']
    },

    // React configurations
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        settings: {
            react: {
                version: 'detect'
            },
            jsx: {
                runtime: 'automatic'
            }
        },
        rules: {
            // React rules
            'react/jsx-uses-vars': 'error',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // General rules
            'no-unused-vars': ['warn', {
                //varsIgnorePattern: '^(React|Gi[A-Za-z]+|Fa[A-Za-z]+|Md[A-Za-z]+|Io[A-Za-z]+|Bi[A-Za-z]+)$',
                ignoreRestSiblings: true,
                argsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_'
            }],

            // Include rules from plugins
            //...reactPlugin.configs.recommended.rules,
            //...reactHooksPlugin.configs.recommended.rules,
            //...jsxA11yPlugin.configs.recommended.rules,
        }
    },
];
