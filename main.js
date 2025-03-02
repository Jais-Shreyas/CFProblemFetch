const problemList = document.getElementsByClassName('problems')
const submit = document.getElementById('submit')
const user = document.getElementById('username')
const rating = document.getElementById('rating')

const url = 'https://codeforces.com/api/problemset.problems';
const problemUrl = 'https://codeforces.com/problemset/problem/';
const getProblems = async (user, rating) => {
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
  const userProblems = await fetch(`https://codeforces.com/api/user.status?handle=${user}`);
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
  for (let problem of problems) {
    const problemElement = document.createElement('li');
    problemElement.innerHTML = `<a class="text-white text-decoration-none" href="${problemUrl}${problem.contestId}/${problem.index}" target="_blank">${problem.name}</a>`;
    problemList[0].appendChild(problemElement);
  }
});
