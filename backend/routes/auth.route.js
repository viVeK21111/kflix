import express from 'express';
import {signup,logout,signin,auth0Login} from '../controllers/auth.controller.js'
import {protectRoute} from '../middleware/protectRoute.js'
import { authCheck,changePassword,changePasswordH,deleteAccount,checkAccount,userdetails,allusersdetails,deleteUserAccount } from '../controllers/auth.controller.js'; 

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/auth0', auth0Login);
router.post('/logout',logout);
router.get('/authcheck',protectRoute,authCheck);
router.post('/changepassword',protectRoute,changePassword);
router.post('/changepasswordH',changePasswordH);
router.post('/checkaccount',checkAccount);
router.post('/userdetails',protectRoute,userdetails);
router.get('/allusersdetails',protectRoute,allusersdetails);
router.delete('/deleteUser',protectRoute,deleteAccount);
router.delete('/deleteUserAccount',protectRoute,deleteUserAccount);

export default router;