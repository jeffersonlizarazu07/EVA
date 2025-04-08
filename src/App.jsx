import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
/* catch data */
import { UserProvider } from "./context/UserContext";
/* -------------------------------------------- */
import ProtectedRoute from "./utils/ProtectedRoute";
/* --------------------------------------------*/
/* Layout imports */
import LogIn from "./pages/layout/login";
import Inactive from "./pages/layout/inactive";
/* -------------------------------------------- */

/* SuperAdmin Imports */
import Index from "./components/Admin/index";
import Quality from "./components/Admin/quality";
import Satisfaction from "./components/Admin/satisfaction";
import Client_list from "./pages/admin/client_list";
import AdminList from "./pages/admin/admin_list";
import Agent_Monitoring from "./pages/admin/agent_monitoring";
/* ---------------------------------------------------------*/

/* Admin Imports */

/* ---------------------------------------------------------*/

/* Editor Imports */
import IndexEditor from "./pages/editor/indexEditor";
/* ---------------------------------------------------------*/

/* Viewer Imports */
import IndexQuality from "./pages/quality/indexQuality";

/* ---------------------------------------------------------*/

/* Survey */
import SurveyList from "./pages/survey/survey_list";
import View_survey from "./pages/survey/view_survey";
import Survey from "./pages/survey/survey";
import Gratitude from "./pages/survey/gratitude";

/* ---------------------------------------------------------*/

// graphs imports
import Reports from "./pages/admin/reports"


/* ---------------------------------------------------------*/

export const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/survey/:link" element={<Survey/>}/>
          <Route path="/gratitude" element={<Gratitude/>}/>
          <Route path="/agent_monitoring" element={<Agent_Monitoring />} />
          <Route path="/survey1" element={<View_survey />} />
          {/* Pruebas de barras */}
          {/*error views*/}
          <Route path="/auth/inactive" element={<Inactive />} />
           <Route
            element={<ProtectedRoute redirectPath="/" allowedUserTypes={[1]} />}
          > 
            <Route path="/client_list" element={<Client_list />} />
          </Route> 
          {/*superAdmin sites*/}
         <Route
            element={
              <ProtectedRoute redirectPath="/" allowedUserTypes={[1, 2]} />
            }
          > 
            <Route path="/admin_list" element={<AdminList />} />
            <Route path="/admin" element={<Index />} />
           </Route> 

      <Route
            element={
              <ProtectedRoute redirectPath="/" allowedUserTypes={[1, 2, 3]} />
            }
          >
            <Route path="/reports" element={<Reports/>}></Route>
            <Route path="/satisfaction" element={<Satisfaction />} />
            <Route path="/survey_list" element={<SurveyList />} />
            <Route path="/editor" element={<IndexEditor />} />
            <Route path="/view_survey/:id" element={<View_survey />} />
          </Route> 
          <Route
            element={
              <ProtectedRoute redirectPath="/" allowedUserTypes={[1, 2, 4]} />
            }
          > 
            <Route path="/quality" element={<Quality />} />
            <Route path="/index=Quality" element={<IndexQuality />} />
         </Route> 

          {/*quality sites*/}
          {/* Pruebas de encuestas */}

          {/*admin sites*/}

          {/*editor sites*/}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};
