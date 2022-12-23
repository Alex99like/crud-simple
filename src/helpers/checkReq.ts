export const checkReq = (user: Record<string, string>) => {
  const error: string[] = []
  if (!user.username) error.push('the username field is missing') 
  else if (typeof user.username !== 'string') error.push('the username field is not valid') 

  if (!user.age) { error.push('the age field is missing') }
  else if (typeof user.age !== 'number') error.push('the age field is not valid') 

  if (!user.hobbies) { error.push('the hobbies field is missing') }

  if (user.hobbies) {
    if (!Array.isArray(user.hobbies)) {
        error.push('the hobbies field is not valid')
      }else if (Array.isArray(user.hobbies)) {
        const arrEl = []  
        user.hobbies.forEach(el => {
          if (typeof el !== 'string') {
            arrEl.push(el)
          }
        })
        if (arrEl.length > 0) { error.push('the hobbies field is not valid') }
    }
  }
  return Array.from(new Set(error))
}