# Divekit-Dashboard

## Setting up the project

### Backend:
1. Import Gradle project from
    > /backend/build.gradle
2. Sync Gradle project
3. Create and copy personal access token from https://git.archi-lab.io/-/user_settings/personal_access_tokens
4. Assign token to `gitlab-secret` in
    > /backend/src/main/resources/secrets.properties
5. Run application (`DivekitDashboardApp
6. lication.java`) or run Gradle task `bootRun`

### Frontend:
1. Run `yarn install`
2. Run `npm start`

<br />

## Back-End Overview

### GitlabController

Processes REST requests for milestones.

### REST Endpoints:

| Endpoint                      | Method | Description                                       |
|-------------------------------|--------|---------------------------------------------------|
| /milestones                   | GET    | Returns all milestones.                           |
| /milestones/{id}              | GET    | Returns milestone with the specified ID.          |
| /milestones/sources/**        | POST   | Posts a milestone link.                           |
| /milestones/sources/paths/**  | GET    | Returns the paths of a specific milestone link.   |
| /milestones/refresh           | GET    | Returns all milestones after a refresh.           |
| /milestones/sources           | GET    | Returns all milestone sources.                    |
| /milestones/sources/{id}      | DELETE | Removes all milestones with the specified source. |

<br />

### GitlabParser

Parses the contents from the files on GitLab.

#### Methods
`mdToStudentList`:

- Parses a markdown file (student overview) and returns a list of created students.
- Expected format: List of student data with 4 columns corresponding to:
   - Student username
   - Student repository URL
   - Test repository URL
   - Test overview URL

`htmlToTests`

- Parses the HTML of a test overview page and returns a list of its tests and status.
- Expected format: Test page in current HTML format. Method might require adjustments after updates in test page HTML.

`testsFromGroup`
- Required for htmlToTests, groups the tests to their category (e.g., E01Variables). Method might require adjustments after updates in test page HTML.

<br />

### GitlabService

Responsible for GitLab API calls and reading HTML resources. Requires a GitLab Token.

- Default base URL of the server is https://git.archi-lab.io.
- For a different base URL, assign it to `GITLAB_SERVER` in the class.

Methods:

- fetchMilestoneFile: Sends a GET-request to GitLab to request all milestone files from an overview repository.
- fetchStudentCommits: Sends a GET-request to GitLab to request all commits made by a student for a particular repository. Removes the first commit as it’s auto-generated when creating the repository.
- fetchHtmlString: Opens a URL connection to a student’s test pages to return the HTML as a String.

## Front-End Overview

### Directory Structure

- dashboard: Modules required for the dashboard, the main application.
- chart_modules: Charts for the dashboard based on Nivo charts.
- rest: REST calls to the backend.

### Main Files

- `Dashboard.tsx`: Main file for the dashboard. `<ChartsOverview()>` displays all visible charts. New charts can be added here.
- `<NavBar>`: Navigation bar for dashboard. Default milestone overview link (in the upper right corner) can be changed here.
- `chartData.ts`: Functions that return data required for the charts. They get called in the corresponding Nivo charts. For new charts, data functions can be added here.

### Adding a New Chart:

0. (Optional) Create data function in `chartData.ts`.
1. Create a chart module in `chart_modules`.
   - Pick a suitable chart from [Nivo charts](https://nivo.rocks/).
   - Copy the chart to the most suitable file in `chart_modules` (or create a new one).
   - Set data source in data of Nivo chart to a data function from `chartData.ts` (e.g., `data={getCommitFrequency(students, true)}`).
   - Adjust parameters of chart (size, format).
2. Add chart module to `ChartsOverview()` in `Dashboard.tsx`.

## Use Cases

1. Adding a new milestone source.
2. Selecting a milestone from milestone source.
3. Checking each student in detail.

## Architecture

### Back-End

- Java 17 with Spring Boot and Gradle.
- H2 memory database.
- GitLab4J API for working with the GitLab REST API.

### Front-End

- TypeScript with React (+HTML/CSS).
- Nivo for charts.
- react-spinners for loading bars.
- react-toastify for toast messages.

### Containerization

Both backend and frontend are containerized with Docker.

## Links

- **Spring:** [Spring Documentation](https://docs.spring.io/spring-framework/reference/index.html), [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- **React:** [React Documentation](https://react.dev/reference/react)
- **Java 17:** [Java 17 API Documentation](https://docs.oracle.com/en/java/javase/17/docs/api/)
- **TypeScript:** [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- **GitLab4J API:** [GitHub Repository](https://github.com/gitlab4j/gitlab4j-api/tree/6.x), [API Documentation](https://javadoc.io/doc/org.gitlab4j/gitlab4j-api/latest/index.html)
- **GitLab REST API documentation:** [GitLab REST API Documentation](https://docs.gitlab.com/ee/api/rest/)
- **Nivo:** [Nivo Charts](https://nivo.rocks/), [Nivo Storybook](https://nivo.rocks/storybook/)
- **react-spinners:** [react-spinners Documentation](https://www.davidhu.io/react-spinners/), [react-spinners Storybook](https://www.davidhu.io/react-spinners/storybook/)
- **react-toastify** [react-toastify Documentation](https://fkhadra.github.io/react-toastify/introduction/)

This documentation provides a comprehensive guide for understanding, deploying, and extending the fullstack web application.
