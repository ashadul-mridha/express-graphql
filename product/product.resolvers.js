import { products } from './product.data';

const query = {
    Query: {
        products: () => {
            return products
        }
    }
}

export default query;