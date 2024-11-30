const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const resolvers = {
  Query: {
    weakFlashcards: async (_, { studentId }) => {
        const query = `
        SELECT 
          deck_name, 
          id, 
          question, 
          success_rate
        FROM 
          flashcards
        WHERE 
          student_id = $1 AND success_rate < 50
        ORDER BY 
          deck_name ASC, success_rate ASC
        LIMIT $2 OFFSET $3;
      `;
      const { rows } = await pool.query(query, [studentId, limit, offset]);


      // Group flashcards by deck_name
      const grouped = rows.reduce((acc, row) => {
        if (!acc[row.deck_name]) {
          acc[row.deck_name] = [];
        }
        acc[row.deck_name].push({
          id: row.id,
          question: row.question,
          successRate: row.success_rate,
        });
        return acc;
      }, {});

      // Convert to array format
      return Object.entries(grouped).map(([deckName, flashcards]) => ({
        deckName,
        flashcards,
      }));
    },
  },
};

module.exports = { resolvers };
