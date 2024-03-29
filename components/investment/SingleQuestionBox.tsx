import Layout from "components/Layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSurveyStore from "stores/useSurveyStore";
import { useMutation } from "@apollo/client";
import { GamificationEnum, ISingleQuestion } from "typings/survey";
import { AnimationEnum } from "typings/animation";
import { getSingleQuestionUpdateQuery } from "utils/gql-queries";
import styles from "./investment.module.scss";
import clsx from "clsx";
import { IoIosArrowForward } from "react-icons/io";
import AnimationBox from "components/animations/AnimationBox";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAnimationDuration,
  getFadeInOutVariants,
  getSlideInOutVariants,
} from "utils/animation";

type FormValues = {
  response: string;
};

export interface ISingleQuestionBoxProps {
  fieldName: string;
  question: ISingleQuestion;
  toNext: () => void;
  animation?: AnimationEnum;
}

export default function SingleQuestionBox({
  fieldName,
  question,
  toNext,
  animation,
}: ISingleQuestionBoxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPageExiting, setIsPageExiting] = useState(false);
  const sessionId = useSurveyStore((state) => state.sessionId);
  const gamification = useSurveyStore((state) => state.gamification);
  const shouldAnimate = gamification === GamificationEnum.GAMIFICATION;
  const RECORD_SINGLE_RESPONSE = getSingleQuestionUpdateQuery(fieldName);
  const [recordSingleResponseToDb] = useMutation(RECORD_SINGLE_RESPONSE);

  const { register, watch, formState } = useForm<FormValues>({
    mode: "onChange",
  });

  // User response in string (e.g., "Wealth Preservation")
  const userResponseString = watch("response");

  // User reponse in number (e.g., 1, 2, 3, 4)
  const userResponseNumber =
    question["options"].indexOf(userResponseString) + 1;

  const handleNextButtonClick = async (e) => {
    e.preventDefault();

    // Only proceed if form state is valid (e.g., all required inputs are filled out)
    if (!formState.isValid) {
      return;
    }

    const animationDuration = getAnimationDuration(animation);

    if (shouldAnimate) {
      setIsAnimating(true);

      // Start page exit animation after animationDuration milliseconds
      setTimeout(() => {
        setIsPageExiting(true);
      }, animationDuration);
    }

    if (sessionId) {
      await recordSingleResponseToDb({
        variables: {
          session_id: sessionId,
          response_num: userResponseNumber,
          response_text: userResponseString,
        },
      });
    }

    if (shouldAnimate) {
      // Navigate to next page in animationDuration + 0.3 seconds
      // Animation is displayed for animationDuration milliseconds
      // Exit animation takes 0.3 seconds (300 milliseconds)
      await new Promise((resolve) =>
        setTimeout(resolve, animationDuration + 300)
      );
    }

    toNext();
  };

  return (
    <Layout>
      <main
        key="main"
        className={clsx(styles.investmentBox, {
          [styles.gamification]: gamification === GamificationEnum.GAMIFICATION,
          [styles.noGamification]:
            gamification === GamificationEnum.NO_GAMIFICATION,
        })}
      >
        {isAnimating && (
          <AnimatePresence>
            {!isPageExiting && (
              <motion.div
                key="gameAnimation"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={getFadeInOutVariants(shouldAnimate)}
                className={styles.animationWrapper}
              >
                <AnimationBox animation={animation} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {!isPageExiting && (
            <motion.div
              key="card"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={getSlideInOutVariants(shouldAnimate)}
              className={styles.card}
            >
              <div>{question.text}</div>

              <div className={styles.singleQuestionForm}>
                {question.options.map((o) => (
                  <label
                    key={o}
                    className={clsx(styles.radioLabel, {
                      [styles.selected]: o === userResponseString,
                    })}
                  >
                    <input
                      {...register("response", { required: true })}
                      type="radio"
                      value={o}
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>

              <div className={styles.bottomNavigation}>
                <button
                  disabled={!formState.isValid}
                  onClick={handleNextButtonClick}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnimating && (
          <div className={styles.rightNavigation}>
            <span
              className={clsx(styles.navButton, {
                [styles.disabled]: !formState.isValid,
              })}
              onClick={handleNextButtonClick}
            >
              <IoIosArrowForward className={styles.reactIcon} />
            </span>
          </div>
        )}
      </main>
    </Layout>
  );
}
