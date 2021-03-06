import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import firebase from "firebase/app";

const UserContext = createContext();

export { UserContext };
