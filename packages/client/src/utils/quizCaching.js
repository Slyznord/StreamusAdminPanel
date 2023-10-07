export default (obj) => {
  const preparedData = obj && JSON.stringify(obj)
  localStorage.setItem('quizData', preparedData)
}
