import Layout from "components/Layout";
import usePageNavigation from "hooks/usePageNavigation";
import useSurveyStore from "stores/useSurveyStore";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import styles from "styles/investment.module.scss";

type FormValues = {
  response: string;
};

const RECORD_SINGLE_RESPONSE = gql`
  mutation RecordQ1Response($session_id: uuid!, $response: String) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: { q1: $response }
    ) {
      session_id
    }
  }
`;

const question = {
  text: (
    <>
      Of the options below, which best describes your primary financial goal?
      <br />
      <br />
      When considering investments, I am _______
    </>
  ),
  options: [
    "Most concerned about my investment losing value.",
    "Equally concerned about my investment losing or gaining value.",
    "Most concerned about my investment gaining value.",
  ],
};

export default function Q1Page() {
  const { toNext } = usePageNavigation({
    nextPathname: "/q2",
  });

  const sessionId = useSurveyStore((state) => state.sessionId);

  const { register, watch, formState } = useForm<FormValues>({
    mode: "onChange",
  });
  const userResponse = watch("response");
  const [recordSingleResponseToDb] = useMutation(RECORD_SINGLE_RESPONSE);

  const handleNextButtonClick = async () => {
    await recordSingleResponseToDb({
      variables: {
        session_id: sessionId,
        response: userResponse,
      },
    });

    toNext();
  };

  return (
    <Layout>
      <main className={styles.investmentBox}>
        <div>
          <p>{question.text}</p>

          <div className={styles.singleQuestionForm}>
            {question.options.map((o) => (
              <label key={o} className={styles.radioLabel}>
                <input
                  {...register("response", { required: true })}
                  type="radio"
                  value={o}
                />
                <span>{o}</span>
              </label>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              disabled={!formState.isValid}
              onClick={handleNextButtonClick}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
