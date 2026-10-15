# Codewars Leaderboard project

- [Deployed Website](https://tomdu3-codewars-leaderboard.netlify.app/)
- [GitHub Repository](https://github.com/tomdu3/Checkpoint-Sprint-2-Project)

## About the Project

**Codewars Leaderboard** is a web application that lets you compare Codewars users on a dynamic leaderboard. By entering a comma-separated list of usernames, the application fetches real-time ranking and score data directly from the [Codewars API](https://dev.codewars.com/#get-user) and presents them in an interactive, sortable leaderboard table.

---

## How it works

1. **Enter Codewars usernames**: In the input field, type one or more Codewars usernames separated by commas.
   - _Example_: `CodeYourFuture, 40thieves, SallyMcGrath`
2. **Fetch Data**: Click the **Get Data** button or press <kbd>Enter</kbd>.
3. **View the Leaderboard**: The table will display the users' **Username**, **Clan**, and **Score**, sorted from highest to lowest score with the top user highlighted.
4. **Filter by Language**: Use the **Select ranking** dropdown to view rankings for any programming language your entered users have completed challenges in.

---

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tomdu3/Checkpoint-Sprint-2-Project.git
   cd Checkpoint-Sprint-2-Project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:
   Since this is a client-side ES module application, open `index.html` using a local HTTP server:

   ```bash
   # Using npx serve
   npx serve .

   # Or using Python's built-in server
   python3 -m http.server
   ```

   Alternatively, open `index.html` using the **Live Server** extension in VS Code.

---

## Testing

The project includes an extensive unit test suite using Node.js's built-in test runner (`node:test`) and [Nock](https://github.com/nock/nock) to mock Codewars API responses.

To run the unit tests:

```bash
npm test
```

For detailed verification and screenshots covering all project requirements and rubric criteria, see [**TESTING.md**](./TESTING.md).

## Developer details

- Tomislav Dukez ([tomdu3](https://github.com/tomdu3))

&copy; 2026 Tomislav Dukez
