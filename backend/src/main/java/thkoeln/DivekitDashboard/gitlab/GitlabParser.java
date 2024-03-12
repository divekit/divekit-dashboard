package thkoeln.DivekitDashboard.gitlab;

import thkoeln.DivekitDashboard.student.MilestoneTest;
import thkoeln.DivekitDashboard.student.Student;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GitlabParser {
    public static List<Student> mdToStudentList(String mdString){
        String string = mdString.trim().replace("\n", "");
        String separator = "|-|-|-|-|";
        int startingChar = string.indexOf(separator) + separator.length() + 1; // + 10
        int column = -1;

        StringBuilder name = new StringBuilder();
        StringBuilder codeRepoURL = new StringBuilder();
        StringBuilder testRepoURL = new StringBuilder();
        StringBuilder testOverviewURL = new StringBuilder();

        List<Student> students = new ArrayList<>();

        for (int i = startingChar; i < string.length(); i++) {
            char c = string.charAt(i);
            if(c == ' '){ // empty space after each row of students needs to be skipped
                continue;
            }
            if(c == '|'){ // start of new table column
                if(column < 3){
                    column++;
                } else if (column == 3){
                    Student student = new Student(name.toString(),
                            codeRepoURL.toString(),
                            testRepoURL.toString(),
                            testOverviewURL.toString(),
                            null);
                    students.add(student);

                    name.setLength(0);
                    codeRepoURL.setLength(0);
                    testRepoURL.setLength(0);
                    testOverviewURL.setLength(0);
                    column = -1;
                }
            } else if(column == 0){
                name.append(c);
            } else if(column == 1){
                codeRepoURL.append(c);
            } else if(column == 2){
                testRepoURL.append(c);
            } else if(column == 3){
                testOverviewURL.append(c);
            }
        }

        return students;
    }

    public static ArrayList<MilestoneTest> htmlToTests(String htmlString) {
        if (htmlString == null || htmlString.contains("Der Test konnte nicht ordnungsgemäß ausgeführt werden.")) {
            return new ArrayList<>();
        }

        String htmlStringTrimmed = substringBetween(htmlString, "<hr", "</div></nav>");
        ArrayList<String> testGroupElements = new ArrayList<>(Arrays.asList(htmlStringTrimmed.split("<h2")));
        if (!testGroupElements.get(0).contains("a href")) {
            testGroupElements.remove(0);
        }

        ArrayList<MilestoneTest> milestoneTests = new ArrayList<>(List.of());
        for (String testGroupElement : testGroupElements) {
            String groupName = "unassigned";
            if (testGroupElement.contains("h2")) {
                groupName = substringBetween(testGroupElement, ">", "</h2>");
            }
            List<String> testElements = List.of(testGroupElement.split("</a>"));
            milestoneTests.addAll(testsFromGroup(groupName, testElements));
        }

        return milestoneTests;
    }

    public static List<MilestoneTest> testsFromGroup(String groupName, List<String> testElements) {
        ArrayList<MilestoneTest> tests = new ArrayList<>();

        testElements.forEach(testElement -> {
            int id = Integer.parseInt(substringBetween(testElement, "report-", "\"").replaceAll("[^0-9]", ""));
            String name = testElement.substring(testElement.lastIndexOf(">") + 1);
            boolean isPassed = testElement.contains("is-success");
            tests.add(new MilestoneTest(id, name, groupName, isPassed));
        });

        return tests;
    }


    private static String substringBetween(String str, String first, String second) {
        return str.substring(str.indexOf(first) + first.length(), str.lastIndexOf(second));
    }
}
