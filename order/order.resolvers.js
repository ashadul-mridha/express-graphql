import { orders } from './order.model.js';

const query = {
    Query: {
        orders: () => {
            return orders
        }
    }
}

export default query;