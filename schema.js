const { gql } = require("apollo-server");

const typeDefs = gql`
  type Flashcard {
    id: ID!
    question: String!
    successRate: Float!
  }

  type WeakFlashcardsGroup {
    deckName: String!
    flashcards: [Flashcard!]!
  }

  type Query {
    weakFlashcards(studentId: ID!): [WeakFlashcardsGroup!]!
  }
`;

module.exports = { typeDefs };