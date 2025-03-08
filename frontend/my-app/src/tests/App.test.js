import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
    test('renders app title', async () => {
        await act(async () => {
            render(<App />);
        });
        expect(screen.getByText('IT Job Management App')).toBeInTheDocument();
    });

    test('renders input fields and submit button', async () => {
        await act(async () => {
            render(<App />);
        });
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Years of Experience')).toBeInTheDocument();
        expect(screen.getByText('Add IT Professional')).toBeInTheDocument();
    });
});
