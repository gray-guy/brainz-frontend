"use client";
import BackModal from "@/app/components/BackModal";
import { CountDown } from "@/app/components/CountDown";
import { ProgressBar } from "@/app/components/Progressbar";
import { SelectAnswer } from "@/app/components/SelectAnswer";
import { SessionHeader } from "@/app/components/SessionHeader";
import { SessionResult } from "@/app/components/SessionResult";
import { apiCall } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const Session = ({ params }) => {
  const [stage, setStage] = useState("countdown");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [session, setSession] = useState({});
  const [game, setGame] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [question, setQuestion] = useState();
  const router = useRouter();
  const socketRef = useRef(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [powerUsed, setPowerUsed] = useState({
    fiftyFifty: false,
    autoCorrect: false,
  });
  const [rewardEarned, setRewardEarned] = useState({});

  useEffect(() => {
    const getSession = async (id) => {
      const data = await apiCall("get", `/session/${id}`);
      if (!data || !data.session) {
        return router.push("/dashboard");
      }
      setSession(data.session);
      if (new Date(data.session.startTime) < new Date()) {
        toast.error("session already ended");
        router.push("/dashboard");
      }
    };

    getSession(params.id);
  }, []);

  useEffect(() => {
    const getGame = async () => {
      const data = await apiCall("get", `/game/${session.gameID}`);
      setGame(data.game);
    };
    session.gameID && getGame();
  }, [session]);

  const handleContinue = () => {
    setShowModal(false);
  };

  // useEffect(() => {
  //   if (stage === "countdown" || stage === "selectAnswer") {
  //     const handleBeforeUnload = (event) => {
  //       event.preventDefault();
  //       event.returnValue = "";
  //       setShowModal(true);
  //     };

  //     const handleBackNavigation = (event) => {
  //       event.preventDefault();
  //       setShowModal(true);
  //     };

  //     window.addEventListener("beforeunload", handleBeforeUnload);
  //     window.history.pushState(null, null, window.location.pathname);
  //     window.addEventListener("popstate", handleBackNavigation);

  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //       window.removeEventListener("popstate", handleBackNavigation);
  //     };
  //   }
  // }, [showModal, stage]);

  const handleAnswerSelect = (answer) => {
    setQuestion({ ...question, answer });
    if (socketRef.current) {
      socketRef.current.emit("submitAnswer", { answer });
    }
  };

  const handleUsePower = (powerType) => {
    if (questionTimeRemaining <= 0) {
      toast.error("You cannot use power now");
      return;
    }
    if (powerType === "fifty-fifty" && question.answers.length < 4) {
      toast.error("This power cannot be used now");
      return;
    }
    if (powerUsed[powerType]) {
      toast.error("You have already used this power");
      return;
    }
    if (socketRef.current) {
      socketRef.current.emit("usePower", { powerType });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    socketRef.current = socket;
    socket.on("connect", () => {});
    socket.on("error", ({ message }) => {
      toast.error(message);
    });
    socket.emit("joinSession", { sessionId: params.id });

    socket.on("sessionNotStarted", ({ timeRemaining }) => {
      setRemainingTime(timeRemaining);
    });
    socket.on("sessionCompleted", () => {
      setStage("sessionResult");
    });
    socket.on("rewardSuccess", (data) => {
      if (data) {
        setRewardEarned(data);
        toast.success(data.message);
      }
    });

    socket.on("newQuestion", ({ question }) => {
      if (stage === "countdown") {
        setStage("selectAnswer");
      }
      setStep((prev) => prev + 1);
      setQuestion(question.question);
    });

    socket.on("questionTimeRemaining", ({ questionTimeRemaining }) => {
      setQuestionTimeRemaining(questionTimeRemaining);
      // console.log({ questionTimeRemaining });
    });
    socket.on("restTimeRemaining", ({ restTimeRemaining }) => {
      setRestTimeRemaining(restTimeRemaining);
      // console.log({ restTimeRemaining });
    });
    socket.on("leaderboardUpdate", (data) => {
      setLeaderboard(data);

      // console.log(data);
    });

    return () => {
      if (socket.connected) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("fiftyFifty", ({ answers }) => {
        if (!question) return;
        const correctAnswer = question.answers.find(
          (ans) => ans === answers[0]
        );
        const wrongAnswers = question.answers.filter(
          (ans) => ans !== correctAnswer
        );
        const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
        let newAnswers = [correctAnswer, wrongAnswers[randomIndex]];
        newAnswers = newAnswers.sort(() => Math.random() - 0.5);
        setQuestion({ ...question, answers: newAnswers, answer: null });
        toast.success("2 wrong answers have been removed");
        setPowerUsed({ ...powerUsed, fiftyFifty: true });
      });

      socketRef.current.on("autoCorrect", ({ answer }) => {
        if (!question) return;
        setQuestion({ ...question, answer });
        toast.success("Your answer has been automatically submitted");
        setPowerUsed({ ...powerUsed, autoCorrect: true });
      });
      socketRef.current.on("answerSubmitted", ({ correctAnswer }) => {
        if (!question) return;
        setQuestion({ ...question, correctAnswer });
      });
    }
    return () => {
      socketRef.current.off("fiftyFifty");
      socketRef.current.off("autoCorrect");
      socketRef.current.off("answerSubmitted");
    };
  }, [question]);

  const progess = (step / session.totalQuestions) * 100 - 1;
  return (
    <div className="relative">
      {stage === "countdown" && (
        <>
          <SessionHeader title={game.title} />
          <div className="px-6 pt-8 pb-3 lg:pt-10 lg:pb-7 lg:px-7">
            <CountDown session={session} timeRemaining={remainingTime} />
          </div>
        </>
      )}
      {stage === "selectAnswer" && (
        <>
          <div className="hidden md:block">
            <SessionHeader />
          </div>
          <div className="hidden md:block fixed  top-[76px] left-0 w-full h-2 z-30 transition ease-in">
            <ProgressBar progress={progess} step={step} />
          </div>
          <div className="mt-0 md:mt-8 lg:mt-10">
            <SelectAnswer
              setSelectedOption={handleAnswerSelect}
              question={question}
              step={step}
              progress={progess}
              questionTimeRemaining={questionTimeRemaining}
              restTimeRemaining={restTimeRemaining}
              leaderboard={leaderboard}
              handleUsePower={handleUsePower}
              title={game.title}
              powerUsed={powerUsed}
              session={session}
              // handleStageChange={handleStageChange}
            />
          </div>
        </>
      )}
      {stage === "sessionResult" && leaderboard && (
        <>
          <SessionHeader />
          <div className="pt-8 pl-6 pr-6 lg:pt-10 md:pl-14 md:pr-16">
            <SessionResult
              leaderboard={leaderboard}
              session={session}
              game={game}
              rewardEarned={rewardEarned}
            />
          </div>
        </>
      )}
      {showModal && (
        <BackModal
          showModal={showModal}
          setShowModal={setShowModal}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
