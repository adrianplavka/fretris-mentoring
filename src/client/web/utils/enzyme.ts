
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme adapter for React v16.
export const initEnzyme = () => {
    enzyme.configure({ adapter: new Adapter() });
};
