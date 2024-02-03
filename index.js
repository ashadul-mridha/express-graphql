import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './product/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = loadFilesSync(path.join(__dirname, './**/*.graphql'));
// const resolvers = loadFilesSync(path.join(__dirname, './**/*.resolvers.js'));

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    // resolvers: resolvers
    resolvers: {
        Query: {
            products: (parent, args, context, info) => {
                console.log('products resolver');
                return products
            },
            productBYFilter: (parent, args, context, info) => {
                const { maxPrice, minPrice } = args
                return products.filter(product => product.price >= minPrice && product.price <= maxPrice)
            }, 
            getProduct: (_, args) => {
              return products.find( (p) => p.id == args.id)
            },
            orders: () => {
              return orders
            }
        },
        Mutation: {
          addNewProduct: (_, args) => {
            const { desc, price } = args
            const newProduct = {
              id: products.length + 1,
              desc: desc,
              price: price
            }
            console.log('newProduct', newProduct);
            products.push(newProduct)
            return newProduct
          
          },
          addReviewToProduct: (_, args) => {
            const { productId, rating, desc } = args
            const product = products.find( (p) => p.id == productId)
            product.reviews.push({rating, desc, id: product.reviews.length + 1})
            return product
          },
      }
    }
})


// const root = {
//     products: products,
//     orders: orders
// }

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  // rootValue: root,
  graphiql: true,
}));

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});