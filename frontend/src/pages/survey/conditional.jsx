export default function getRangeOptions(questionType, answers = "",t) {
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
        { optionText: t("vistaEncuestas.SI"), value: "1" },
        { optionText: t("vistaEncuestas.NO"), value: "0" },
      ];

    case "range_difficulty":
      return [
        { optionText: [t("vistaEncuestas.dificil_muy_dificil")], value: "4,5" },
        { optionText: [t("vistaEncuestas.neutro")], value: "3" },
        { optionText: [t("vistaEncuestas.facil_muy_facil")], value: "1,2" },
      ];

    case "range_emoji":
      return [
        { optionText: t("vistaEncuestas.muy_triste_triste"), value: "1,2" },
        { optionText: t("vistaEncuestas.neutro_emote"), value: "3" },
        { optionText: t("vistaEncuestas.feliz_muy_feliz"), value: "4,5" },
      ];

    case "radio_opt": {
      const mappedAnswers = answers.split(", ");
      return mappedAnswers.map((option) => ({
        optionText: option,
        value: option,
      }));
    }

    case "check_opt": {
      const mappedMultipleAnswers = answers.split(", ");
      return mappedMultipleAnswers.map((option) => ({
        optionText: option,
        value: option,
      }));
    }

    case "selector_opt": {
      const mappedSelectorAnswers = answers.split(", ");
      return mappedSelectorAnswers.map((option) => ({
        optionText: option,
        value: option,
      }));
    }

    default:
      return [];
  }
}
