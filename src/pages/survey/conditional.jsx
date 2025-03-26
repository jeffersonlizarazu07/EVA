export default function getRangeOptions(questionType, answers) {
  switch (questionType) {
    case "range_zerototen":
      return [
        { optionText: ["de 0 a 6"], value: "0,1,2,3,4,5,6" },
        { optionText: ["7 u 8"], value: "7,8" },
        { optionText: ["9 o 10"], value: "9,10" },
      ];
    case "range_onetofive":
      return [
        { optionText: ["1 o 2"], value: "1,2" },
        { optionText: ["3"], value: "3" },
        { optionText: ["4 o 5"], value: "4,5" },
      ];
    case "yes_no":
      return [
        { optionText: "Si", value: "yes" },
        { optionText: "No", value: "no" },
      ];
    case "range_difficulty":
      return [
        { optionText: [" Dificil o muy dificil"], value:"hard" },
        { optionText: ["Neutro"], value: "neutral" },
        { optionText: ["Facil o muy facil"], value: "easy" },
      ];
    case "range_emoji":
      return [
        { optionText: "Muy triste: 🙁 o Triste: 😐", value:"sad" },
        { optionText: "Neutro: 😐", value: "neutral" },
        { optionText: "Feliz: 😄 o Muy feliz:😊", value: "happy" },
      ];
    case "radio_opt":
      const mappedAnswers=answers.split(', ')
      console.log('mappedAnswers ',mappedAnswers)
      return mappedAnswers.map((option) => ({ optionText: option, value: option }))
     
     case "check_opt":
      const mappedMultipleAnswers=answers.split(', ')
      return mappedMultipleAnswers.map((option) => ({ optionText: option, value: option }))
    default:
      return [];
  }
}