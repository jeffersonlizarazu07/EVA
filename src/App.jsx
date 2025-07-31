import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from './context/AuthContext'; // <- AGREGAR ESTO
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
import Forms from "./pages/admin/form_list";
import SurveyBlocks from "./pages/quality/surveyBlocks";
import FormReport from "./pages/admin/form_report";
import AgentMonitoringView from "./pages/admin/monitoring_View";
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

// agents
import AgentList from "./pages/admin/agent_list";

/* ---------------------------------------------------------*/

//boostrap imports
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flag-icon-css/css/flag-icons.min.css';

/* ---------------------------------------------------------*/

const App = () => {
  return (
    <AuthProvider> {/* <- CAMBIO: Envolver con AuthProvider */}
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/survey/:link" element={<Survey />} />
            <Route path="/gratitude" element={<Gratitude/>}/>
            <Route path="/agent_monitoring" element={<Agent_Monitoring />} />
            <Route path="/forms" element={<Forms />} />

            <Route
                element={
                  <ProtectedRoute redirectPath="/" allowedUserTypes={[1,2,3,4]}/>
                }
              >
              
              <Route path="/forms_report" element={<FormReport/>}/>
            </Route>
            
            <Route path="/survey_blocks/:id_form" element={<SurveyBlocks />} />
            <Route path="/monitoring_view/:agentId" element={<AgentMonitoringView />} />
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
                <ProtectedRoute redirectPath="/" allowedUserTypes={[1, 2, 3,4]} />
              }
            >
              <Route path="/reports" element={<Reports/>}></Route>
              <Route path="/satisfaction" element={<Satisfaction />} />
              <Route path="/survey_list" element={<SurveyList />} />
              <Route path="/editor" element={<IndexEditor />} />
              <Route path="/view_survey/:id" element={<View_survey />} />
              <Route path="/agent_list" element={<AgentList />} /> 
            </Route> 
            <Route
              element={
                <ProtectedRoute redirectPath="/" allowedUserTypes={[1, 2, 3,4,]} />
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
    </AuthProvider>
  );
};

export default App;