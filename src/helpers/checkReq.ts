const checkName = (error: string[], user: Record<string, string>) => {
  if (!user.username) error.push('the username field is missing') 
  else if (typeof user.username !== 'string') error.push('the username field is not valid')
}

const checkAge = (error: string[], user: Record<string, string>) => {
  if (!user.age) { error.push('the age field is missing') }
  else if (typeof user.age !== 'number') error.push('the age field is not valid') 
}

const checkField = (error: string[], user: Record<string, string>) => {
  const fields = ['username', 'age', 'hobbies']
  let res = 0
  const noValidField = []
  for (const item of Object.keys(user)) {
    if (fields.includes(item)) res += 1
    else noValidField.push(item)
  }

  if (noValidField.length > 0) error.push(`this fields is no valid: ${noValidField.join(', ')}`)
  if (res < 1) error.push(`there are no valid values`)
}

const checkHobbies = (error: string[], user: Record<string, string>) => {
  if (!user.hobbies) { error.push('the hobbies field is missing') }

  if (user.hobbies) {
    if (!Array.isArray(user.hobbies)) {
        error.push('the hobbies field is not valid')
    } else if (Array.isArray(user.hobbies)) {
      const arrEl = []  
      user.hobbies.forEach(el => {
      if (typeof el !== 'string') {
        arrEl.push(el)
      }
    })
    if (arrEl.length > 0) { error.push('the hobbies field is not valid') }
    }
  }
}

export const checkCreate = (user: Record<string, string>) => {
  const error: string[] = []
  checkName(error, user)
  checkAge(error, user) 
  checkHobbies(error, user)
  checkField(error, user)
  
  return Array.from(new Set(error))
}

export const checkUpdate = (user: Record<string, string>) => {
  const error: string[] = []
  if (user.username) checkName(error, user)
  if (user.age) checkAge(error, user) 
  if (user.hobbies) checkHobbies(error, user)
  checkField(error, user)

  return Array.from(new Set(error))
}