import { IImageProps, Image } from 'native-base'

type AvatarPRops = IImageProps & {
  size: number
}

export function Avatar({ size, ...rest }: AvatarPRops) {
  return (
    // eslint-disable-next-line
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={2}
      borderColor="indigo.300"
      {...rest}
    />
  )
}
