import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import UserComp from "../../components/User";

import { UserContext } from "../../context";
import { getIsMobileOrTablet } from "../../util";
import { getUserInfo, getUserMatches, hasUserCompletedProfile } from "./util";

function MakeFriendsPage() {
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [matches, setMatches] = useState([]);
  const [starterModal, setStarterModal] = useState(!user);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    if (user)
      getUserInfo((newUserInfo) => {
        setUserInfo(newUserInfo);
        if (hasUserCompletedProfile(newUserInfo))
          getUserMatches(setMatches, user.uid);
      }, user.uid);
    else {
      setUserInfo({});
      setMatches([]);
    }
  }, [user]);

  return (
    <Page className="bg-blue-2 align-center pa16">
      {!user && (
        <Container
          className={
            "column full-center bg-white pa16 br8 " +
            (isMobileOrTablet ? "mx8" : "container large ")
          }
        >
          <h6 className="clickable tac" onClick={() => setStarterModal(true)}>
            Get matches with other awesome people on Vent With strangers!
            <span className="blue"> Get started now :) </span>
          </h6>
        </Container>
      )}

      {user && !hasUserCompletedProfile(userInfo) && (
        <Container
          className={
            "column full-center bg-white pa16 mt16 br8 " +
            (isMobileOrTablet ? "mx8" : "container large ")
          }
        >
          <Link to="/account">
            <h6 className="tac">
              Complete your
              <span className="blue"> Profile Interests </span>
              so we can start making you recommendations :)
            </h6>
          </Link>
        </Container>
      )}

      <Container
        className={
          "column full-center bg-white pa16 mt16 br8 " +
          (isMobileOrTablet ? "mx8" : "container large ")
        }
      >
        <h1 className="primary tac mb16">Make Friends Online</h1>
        <h4 className="grey-1 tac">
          Making friends online has never been better! :) Tell us a little bit
          about yourself and we can help you make friends!
        </h4>
      </Container>

      {user && hasUserCompletedProfile(userInfo) && (
        <Container className="wrap container justify-center gap16 mb32 mt16">
          {matches.map((matchedUserInfo, index) => {
            return (
              <UserComp
                additionalUserInfo={matchedUserInfo}
                key={index}
                showAdditionaluserInformation
                showMessageUser
                userID={matchedUserInfo.userID}
              />
            );
          })}
        </Container>
      )}
      <Container className="column full-center bg-white pa16 mt16 br8">
        <Container className="x-fill wrap gap16">
          <div className="x-fill">
            <p>
              It can be hard to find people you resonate with in person
              sometimes. That’s why it’s crucial to find friends online. Whether
              in person or digital, communities help us feel connected and
              heard. Find the friends online who genuinely get you! We’ve
              created an app to let you do just that! Here are some of the
              details and the down-low on how to do it, why you should do it,
              and the key to finding the right friends online for you.
            </p>
          </div>
          <div className="x-fill">
            <h4>Safety first:</h4>
            <p>
              Now, more than ever, the world needs safe spaces online — that’s
              where we spend so much of our time! There are many ways to make
              friends online, from apps that help us make friends on our phones
              to social media and chat circles. Sometimes, spilling your heart
              out to someone in person isn’t the most accepting and safe space
              to share. That’s why online friendships can be a safe, wonderful
              place to vent and share your heart. That’s part of why we created
              VWS! We have a no-tolerance policy for trolls, bullying, or anyone
              putting others’ mentall health at risk.
            </p>
          </div>

          <div className="x-fill">
            <h4>
              Here are a few steps to creating safe, online spaces for yourself
              and others:
            </h4>
            <p>
              Find the right group for you. Do not give out personal information
              such as your name, address, phone number, etc. Report anyone
              participating in cyberbullying, hate speech, or is judging others
              for their honesty. Be open, be yourself, be accepting.
            </p>
            <p>
              When you come into a space, even one online, that's welcoming and
              accepting, the world gets a little bit better. Sometimes, that's
              exactly what you need to make it through the day! Virtual hugs are
              where it's at.
            </p>
          </div>

          <div className="x-fill">
            <h4>This one is for the extroverts:</h4>
            <p>
              Let's face it, COVID-19 has forced us all to spend more time
              alone… and those of us who are extroverted had a tough time.
              That's why extroverts need to meet new friends online. How else
              can you get that socializing in from lockdown? Plus, having an
              online social circle is becoming more and more common. Over half
              of teens have made friends online. It may feel weird at first, but
              online friendships are just as valuable as in-person ones. So,
              let's remove the stigma around it, shall we? As long as you're
              safe, many great things can come from making friends online. Maybe
              you'll even find some solace in talking with other
              extrovert-gone-introverts about the struggles — and the unexpected
              benefits — of spending a little bit more time alone.
            </p>
          </div>
          <div className="x-fill">
            <h4>For the introverts:</h4>
            <p>
              As tempting as it is, spending every day alone isn't always the
              best. Even introverts need a space to come together and find new
              friends. It does come with some perks — especially online! Once
              you've had your social fill, you just log out. Do you experience
              anxiety when talking to someone new in person and trying to break
              the ice? When you make friends online, it's easier to open up and
              have those conversations. Plus, you get to know people faster
              without all that nerve-wracking ice breaker stuff. Often, it's a
              space where you can really be yourself. Don't see yourself being
              friends with the people in your town? Online, you can make friends
              with people from around the world all from the comfort of your
              couch. That's pretty neat!
            </p>
          </div>
          <h4>Why online friendships?</h4>
          <div className="x-fill">
            <p>
              For many, making friends online is even better than in real life.
              Why? Let's spell it out. You don't have to leave your couch if you
              don't want to, and no more of those awful ice breakers! It's
              easier to get into those genuine conversations and get to know
              someone faster when chatting online. You can meet way more people
              from all over the world. If you've ever felt like you don't fit in
              where you are, you don't have to make friends where you are. Your
              people are out there! We're beginning to see less stigma around
              making friends online, so you don't have to feel like you need to
              hide your new friends and connections. You don't even have to
              spend money to hang out with them. You can still get together with
              them — even during lockdowns. Sometimes, it can be scary to just
              be yourself and talk openly. There's something about doing that
              behind a screen that opens things up. If you really need to talk
              about something important but don't feel like you can in person,
              online friendships can help make that happen. And we want to make
              those online friendships happen!
            </p>
          </div>
          <h4>Finding your niche:</h4>
          <div className="x-fill">
            <p>
              Want to find out where you truly fit in? There are many ways to
              meet online friends with whom you can genuinely build an ongoing
              friendship. Solutions like VWS are necessary to get that human
              connection and contact (even from afar), now that there’s less
              physical contact happening globally. Nowadays, most people have
              made at least one friend or connection online through an app or
              social media. For us, we want you to find the right niche and
              facilitate that. VWS is a great place to be yourself, find
              support, and make connections with people who really see you for
              you. Just fill out your profile a little bit and start finding
              friends! While in-person friendships are still valuable and
              essential, you can find the right place and the right people with
              friend-making apps and sites like ours. So, go ahead! Find your
              niche and meet new friends online.
            </p>
          </div>
        </Container>
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default MakeFriendsPage;
