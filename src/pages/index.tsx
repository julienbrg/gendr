import { Heading, Button, FormLabel, Input, useToast } from '@chakra-ui/react'
import { Head } from '../components/layout/Head'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState } from 'react'
import Image from 'next/image'
import useSound from 'use-sound'
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isCalled, setIsCalled] = useState<boolean>(false)
  const [firstName, setFirstName] = useState<string>('Jean-Michel')
  const [gender, setGender] = useState<string>('')
  const [probability, setProbability] = useState<string>('')

  const toast = useToast()
  const [play, { stop, pause }] = useSound(stevie, {
    volume: 0.3,
  })

  const handleInput = async (typedFirstName: string) => {
    stop()
    setIsCalled(false)
    setFirstName(typedFirstName)
  }

  const handleResponse = async (data: any) => {
    console.log('data:', data)
    if (data.gender === 'male') {
      setIsCalled(true)

      setGender('masculin')
    } else {
      setIsCalled(true)

      setGender('féminin')
    }

    const proba = (data.probability * 100).toFixed(0)
    setProbability(proba)

    if (data.count > 3000 && data.count < 9000) {
      setIsCalled(true)

      toast({
        title: 'Données insuffisantes 😿',
        description:
          "Le nombre d'occurences de ce prénom est trop faible, donc le résultat indiqué ne peut pas être considéré comme fiable. Veuillez nous en excuser.",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)
      return
    }

    if (data.count < 3000) {
      setIsCalled(false)
      toast({
        title: 'Prénom inexistant 😿',
        description: "Le prénom que vous avez indiqué n'existe probablement pas. Merci d'en choisir un autre",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)
      return
    }
  }

  const call = async () => {
    try {
      console.log('calling the API...')
      setLoading(true)
      if (firstName === '') {
        toast({
          title: 'Erreur 😿',
          description: 'Merci de taper un prénom dans le champ indiqué.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      const url = 'https://api.genderize.io/?name=' + firstName
      await fetch(url)
        .then((response) => response.json())
        .then((data) => handleResponse(data))

      setLoading(false)
      // play()
    } catch (e) {
      setLoading(false)
      console.log('error:', e)
      toast({
        title: 'Wooops 😿',
        description: 'Mille excuses, il y a eu une erreur : ' + e,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head />

      <main>
        <Heading as="h2">Bienvenue ! </Heading>
        <br />

        <FormLabel>Veuillez taper le prénom de votre choix dans le champs ci-dessous :</FormLabel>
        <Input value={firstName} onChange={(e) => handleInput(e.target.value)} placeholder={firstName} />
        <br />

        <br />

        {!loading ? (
          <Button colorScheme="green" variant="outline" onClick={call}>
            C&apos;est parti ! 🚀
          </Button>
        ) : (
          <Button isLoading colorScheme="green" loadingText="Calling..." variant="outline">
            C&apos;est parti ! 🚀
          </Button>
        )}

        {isCalled && (
          <>
            <br />
            <br />
            <p>
              D&apos;après{' '}
              <LinkComponent target="blank" href={'https://genderize.io'}>
                Genderize.io
              </LinkComponent>
              ,{' '}
              <strong>
                {firstName} est un prénom {gender} dans {probability}% des cas.
              </strong>{' '}
            </p>
          </>
        )}
        <br />
        {/* {isCalled && (
          <>
            <Button colorScheme="red" variant="outline" onClick={() => stop()}>
              Arrêter la musique
            </Button>
            <br />
            <br />
            <Image height="800" width="800" alt="yin-yang" src="/yin-yang.png" />
          </>
        )} */}
      </main>
    </>
  )
}
