import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Loginapi from '../../api/Login/Loginapi';
import { Select_PermissionsByIdPersonnal, Select_RolesByIdPersonnal } from '../../api/PersonnalAPI/Personnalapi';
import { InsertDelete_Personnal_Roles } from '../../api/RolesAPI/Rolesapi';
import * as constant from '../../constants/Constants';
import { withOfflineFallback } from '../../services/offilineSwitch';
import * as SQLiteToken from '../../services/Token';
import * as SQLiteUser from '../../services/User';
import { setUserInfo } from '../../store/slices/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { userInfo, token } = useSelector((state: any) => state.user);
  const { forceOffline, isConnected } = useSelector((state: any) => state.app);
  const isOfflineMode = !isConnected || forceOffline;

  useEffect(() => {
    if (userInfo) router.replace('/main/Home');
  }, [userInfo]);

  const initialValues = {
    option: 3,
    idPersonnal: 0,
    noemployee: '',
    idLocation: 0,
    idCenter: 0,
    password: '',
  };

  const validate = async (formData: typeof initialValues) => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.noemployee) errors.noemployee = 'Employee number is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async (formData) => {
      setLoading(true);
      setLoginError('');
      try {
        const result = await withOfflineFallback({
          isOfflineMode,
          online: async () => {
            const loginData = await Loginapi(formData, token);
            if (!loginData || loginData.length === 0) {
              return { ok: false, message: 'User or password is incorrect.' };
            }
            await SQLiteToken.sqlite_InsertToken(token, loginData[0].idPersonnal);
            await SQLiteUser.sqlite_InsertUser(loginData[0]);
            await setterPersonnalPermissions(loginData[0], token);
            return { ok: true, token, user: loginData[0] };
          },
          offline: async () => {
            const offlineUser = await SQLiteUser.sqlite_LoginValidation(formData);
            if (offlineUser.status !== 'success') {
              return { ok: false, message: offlineUser.message };
            }
            const savedToken = await SQLiteToken.sqlite_GetToken(offlineUser.user);
            if (!savedToken?.token) {
              return { ok: false, message: 'No token found for offline login.' };
            }
            return { ok: true, token: savedToken.token, user: offlineUser.user };
          },
        });

        if (!result.ok) {
          setLoginError(result.message);
        } else {
          dispatch(setUserInfo(result.user));
          router.replace('/main/Home');
        }
      } catch (error) {
        console.log('Error', error);
        setLoginError('Something went wrong. Try again.');
      } finally {
        formik.setFieldValue('password', ''); // conserva el número de empleado si falla
        setLoading(false);
      }
    },
  });

  async function setterPersonnalPermissions(user: any, token: string) {
    if (!user) return;

    const params = { option: 0, idPersonnal: user.idPersonnal };
    let roles = await Select_RolesByIdPersonnal(params, token);

    if (roles.length === 0) {
      const jsVar = {
        option: 0,
        idpersonnal: parseInt(user.idPersonnal),
        idrole: 0,
        email: '',
        sipExtension: '',
        sipPassword: '',
        idPersonnalInsert: user.idPersonnal,
      };
      const insert = await InsertDelete_Personnal_Roles(jsVar, token);
      if (insert.id > 0) roles = await Select_RolesByIdPersonnal(params, token);
    }

    const permissions = await Select_PermissionsByIdPersonnal(params, token);
    user.roles = roles;
    user.permissions = permissions;
    dispatch(setUserInfo(user));
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          {/* Marca: expo-image sí renderiza SVG (el Image de react-native no) */}
          <View style={styles.hero}>
            <Image
              source={require('../../assets/images/ERP_Logo.svg')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          {/* Formulario */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>

            {/* Estado de conexión */}
            <View style={[styles.statusRow, { backgroundColor: colors.surfaceVariant }]}>
              <View style={[styles.statusDot, { backgroundColor: isOfflineMode ? colors.error : '#16A34A' }]} />
              <Text style={styles.statusText}>{isOfflineMode ? 'Offline' : 'Online'}</Text>
            </View>

            <View>
              <TextInput
                label="Employee number"
                mode="outlined"
                value={formik.values.noemployee}
                onChangeText={formik.handleChange('noemployee')}
                onBlur={formik.handleBlur('noemployee')}
                error={formik.touched.noemployee && Boolean(formik.errors.noemployee)}
                left={<TextInput.Icon icon="badge-account-horizontal-outline" />}
                autoCapitalize="none"
                returnKeyType="next"
                outlineStyle={styles.outline}
                dense
              />
              <HelperText type="error" visible={!!(formik.touched.noemployee && formik.errors.noemployee)} style={styles.helper}>
                {formik.errors.noemployee}
              </HelperText>
            </View>

            <View>
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                onSubmitEditing={() => formik.handleSubmit()}
                error={formik.touched.password && Boolean(formik.errors.password)}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                returnKeyType="go"
                outlineStyle={styles.outline}
                dense
              />
              <HelperText type="error" visible={!!(formik.touched.password && formik.errors.password)} style={styles.helper}>
                {formik.errors.password}
              </HelperText>
            </View>

            {loginError !== '' && (
              <View style={[styles.errorBox, { backgroundColor: colors.errorContainer }]}>
                <Icon source="alert-circle-outline" size={18} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.onErrorContainer }]}>{loginError}</Text>
              </View>
            )}

            <Button
              mode="contained"
              onPress={() => formik.handleSubmit()}
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </View>

          <Text style={[styles.version, { color: colors.onSurfaceVariant }]}>Version {constant.APP_VERSION}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  inner: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  hero: { alignItems: 'center', marginBottom: 20 },
  // Proporción del SVG (1081.9 x 312.7 ≈ 3.5 : 1)
  logo: { width: 210, height: 60 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 4 },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 10,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  outline: { borderRadius: 12 },
  helper: { paddingHorizontal: 4, minHeight: 18 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10, marginBottom: 4 },
  errorText: { flex: 1, fontSize: 12 },
  button: { borderRadius: 12, marginTop: 4 },
  buttonContent: { height: 48 },
  buttonLabel: { fontSize: 15, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 11, marginTop: 20, opacity: 0.8 },
});