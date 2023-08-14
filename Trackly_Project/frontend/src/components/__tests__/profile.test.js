import {render, screen, cleanup } from '@testing-library/react'
import {BrowserRouter as Router}  from "react-router-dom";
import {Profile} from '../../pages/profile';

test('render Profile', () => {
    render(<Router><Profile /> </Router>);
    const username = screen.getByTestId('username');
    expect(username).toBeInTheDocument();
})