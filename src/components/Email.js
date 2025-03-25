"use client";
import React from "react";
import { toast, ToastContainer } from "react-toastify";

const Email = () => {
  const [sender, setSender] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let geminires;
        const resOFGemini = await fetch("/api/gemini", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ userPrompt: message }),
        });
        
      if (resOFGemini.status === 200) {
        geminires = await resOFGemini.json();
        setMessage(geminires.message);
      } else {
        toast.error("Unable to generate email body using gemini");
      }

      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, subject, message: geminires?.message ?? message  }),
      });
      if (res.status === 200) {
        toast.success("Email sent successfully");
      } else {
        toast.error("Email not sent");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" p-5">
      <form className=" flex flex-col gap-3 w-fit" onSubmit={handleSubmit}>
        <input
          value={sender}
          type="email"
          placeholder="Your Email address"
          onChange={(e) => setSender(e.target.value)}
          className="border border-black min-w-96 rounded min-h-7"
        />
        <input
          value={subject}
          type="text"
          placeholder="Subject"
          onChange={(e) => setSubject(e.target.value)}
          className="border border-black min-w-96 rounded min-h-7"
        />
        <textarea
          value={message}
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          className="border border-black min-w-96 rounded min-h-7"
        ></textarea>
        <button
          type="submit"
          className=" bg-blue-300 p-2 rounded w-fit  mx-auto"
        >
          Send Email
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Email;
