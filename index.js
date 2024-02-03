import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import { orders } from './order/order.model.js';
import { products } from './product/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = loadFilesSync(path.join(__dirname, './**/*.graphql'));

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
})


const root = {
    products: products,
    orders: orders
}

// const helloSchema = buildSchema(`
// type Query {
//     hello: String
// }
// `);

// const helloRoot = {
//     hello: 'Hello world!'
// }

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// app.use('/', graphqlHTTP({
//     schema: helloSchema,
//     rootValue: helloRoot,
//     graphiql: true,
// }))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});