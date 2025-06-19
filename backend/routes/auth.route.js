import express from 'express';
import {signup,logout,signin,googleAuth,googleAuthCallback} from '../controllers/auth.controller.js'
import {protectRoute} from '../middleware/protectRoute.js'
import { authCheck,changePassword,changePasswordH,deleteAccount,checkAccount,userdetails,allusersdetails,deleteUserAccount } from '../controllers/auth.controller.js'; 

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/logout',logout);
router.get('/authcheck',protectRoute,authCheck);
router.post('/changePassword',protectRoute,changePassword);
router.post('/changePasswordH',changePasswordH);
router.delete('/deleteUser',protectRoute,deleteAccount);
router.delete('/deleteUserMail',protectRoute,deleteUserAccount);
router.post('/checkAccount',checkAccount);
router.post('/admin/mail',protectRoute,userdetails);
router.get('/admin/users',protectRoute,allusersdetails);

// Google Auth0 routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;