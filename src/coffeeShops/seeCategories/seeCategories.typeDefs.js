import { gql } from "apollo-server";

export default gql`
    type Query {
        seeCategories(lastId: Int): [Category]
    }
`;