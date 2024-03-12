## Divekit-Dashboard

### Setting up the project

#### Backend:
1. Import Gradle project from
    > /backend/build.gradle
2. Sync Gradle project
3. Create and copy personal access token from https://git.archi-lab.io/-/user_settings/personal_access_tokens
4. Assign token to `gitlab-secret` in
    > /backend/src/main/resources/secrets.properties
5. Run application (`DivekitDashboardApplication.java`) or run Gradle task `bootRun`

#### Frontend:
1. Run `yarn install`
2. Run `npm start`
