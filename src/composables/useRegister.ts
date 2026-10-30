/**
 * The register form's state, client rules and submit.
 *
 * The client rules are hand-written copies of the back's register contract,
 * on purpose: the OpenAPI spec only declares `password.minLength`, so
 * generated validators would miss the rest, and a validation/forms library
 * would still need the rules copied by hand. Revisit when there are more
 * forms. Each rule points to the back rule it copies: a stale copy that is
 * stricter than the back would block valid input.
 */
import { computed, ref } from 'vue'
import { register } from '@/api/auth'
import { useForm } from '@/composables/useForm'
import type { FieldErrors } from '@/composables/useForm'

type RegisterField =
  'name' | 'email' | 'password' | 'passwordConfirmation' | 'accountToken'

// The WHATWG (HTML5) email pattern without a required TLD, at least as loose
// as the back's email rule, so the front never rejects an email the back accepts.
const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const passwordMinLength = 8

const requiredMessage = 'Este campo es obligatorio.'

export function useRegister() {
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const accountToken = ref('')

  const clientErrors = computed(() => {
    const errors: FieldErrors<RegisterField> = {}

    // Back: every field is NotBlank, which treats only '' as blank (spaces pass).
    if (name.value === '') errors.name = [requiredMessage]
    if (accountToken.value === '') errors.accountToken = [requiredMessage]

    // Back: `email` must be a valid email.
    if (email.value === '') {
      errors.email = [requiredMessage]
    } else if (!emailPattern.test(email.value)) {
      errors.email = ['Introduce un email válido.']
    }

    // Back: `password` minLength 8, counted in code points like mb_strlen, not UTF-16 units.
    if (password.value === '') {
      errors.password = [requiredMessage]
    } else if ([...password.value].length < passwordMinLength) {
      errors.password = [
        `La contraseña debe tener al menos ${passwordMinLength} caracteres.`,
      ]
    }

    // Front-only: the back never receives the confirmation.
    if (passwordConfirmation.value === '') {
      errors.passwordConfirmation = [requiredMessage]
    } else if (passwordConfirmation.value !== password.value) {
      errors.passwordConfirmation = ['Las contraseñas no coinciden.']
    }

    return errors
  })

  const { loading, fieldErrors, generalErrors, submit } = useForm({
    fields: { name, email, password, passwordConfirmation, accountToken },
    clientErrors,
    action: () =>
      register({
        name: name.value,
        email: email.value,
        password: password.value,
        accountToken: accountToken.value,
      }),
    errorHandlers: {
      email_already_registered: (_error, { setFieldError }) => {
        setFieldError('email', 'Ya existe una cuenta registrada con ese email.')
      },
    },
  })

  return {
    name,
    email,
    password,
    passwordConfirmation,
    accountToken,
    loading,
    fieldErrors,
    generalErrors,
    submit,
  }
}
