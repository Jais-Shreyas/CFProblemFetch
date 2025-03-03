const problemList = document.getElementsByClassName('problems')
const submit = document.getElementById('submit')
const user = document.getElementById('username')
const rating = document.getElementById('rating')

const url = 'https://codeforces.com/api/problemset.problems?lang=en';
const problemUrl = 'https://codeforces.com/problemset/problem/';
const getProblems = async (user, rating) => {
  console.log(user, rating);
  console.log("Fetching all Problems");
  const allProblems = await fetch(url);
  const allProblemsData = await allProblems.json();
  if (allProblemsData.status !== 'OK') {
    console.error(allProblemsData.status);
    return;
  }
  const problems = allProblemsData.result.problems;
  const filteredProblems = [];
  for (let problem in problems) {
    if (problems[problem].rating) {
      if (problems[problem].rating === parseInt(rating)) {
        filteredProblems.push(problems[problem]);
      }
    }
  }
  console.log("Fetching user problems");
  const userProblems = await fetch(`https://codeforces.com/api/user.status?handle=${user}&lang=en`);
  const userData = await userProblems.json();
  if (userData.status !== 'OK') {
    console.error(userData.status);
    return;
  }
  const userProblemsList = userData.result;
  const solvedProblems = [];
  for (let submission in userProblemsList) {
    solvedProblems.push(userProblemsList[submission].problem.name);
  }
  const unsolvedProblems = [];
  for (let problem of filteredProblems) {
    if (!solvedProblems.includes(problem.name)) {
      unsolvedProblems.push(problem);
    }
  }
  return unsolvedProblems;
}

submit.addEventListener('click', async () => {
  console.log("Request sent");
  const problems = await getProblems(user.value, rating.value);
  problemList[0].innerHTML = '';
  if (!problems) {
    window.alert("Invalid username");
    return;
  }
  if (problems.length === 0) {
    window.alert("No problems found");
    return;
  }
  const table = document.createElement('table');
  table.className = 'table table-dark table-striped';
  const header = document.createElement('tr');
  const headerId = document.createElement('th');
  const headerName = document.createElement('th');
  const headerTags = document.createElement('th');
  headerId.innerHTML = 'Problem ID';
  headerName.innerHTML = 'Problem Name';
  headerTags.innerHTML = 'Tags';
  header.appendChild(headerId);
  header.appendChild(headerName);
  header.appendChild(headerTags);
  table.appendChild(header);
  for (let problem of problems) {
    const problemElement = document.createElement('tr');
    const problemId = document.createElement('td');
    const problemName = document.createElement('td');
    const problemTags = document.createElement('td');
    problemId.innerHTML = `${problem.contestId}/${problem.index}`;
    problemName.innerHTML = `<a class="text-light text-decoration-none" href="${problemUrl}${problem.contestId}/${problem.index}" target="_blank">${problem.name}</a>`;
    problemTags.innerHTML = problem.tags.join(', ');
    problemElement.appendChild(problemId);
    problemElement.appendChild(problemName);
    problemElement.appendChild(problemTags);
    table.appendChild(problemElement);
  }
  problemList[0].appendChild(table);
});
