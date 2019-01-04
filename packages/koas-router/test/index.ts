import KoaRouter from 'koa-router'
import { getDefinitions, oas, OasRouterRegister, Router } from '../src'
import definitions from './team.api.json'
import { DeadTeam, Team } from './team.api'
import * as fs from 'fs'
import { OasHttpCodes } from '@koas/oas'

const wrapJson = (jsonSchema: object) => {
  return {
    title: 'JsonResponse',
    type: 'object',
    properties: {
      data: jsonSchema,
    },
    required: ['data'],
  }
}

oas.info = {
  version: '1.0',
  title: 'Testing KOAS',
}

new Router({
  prefix: '/api/v1',
})
  .register(
    '/teams',
    ['get'],
    ctx => {
      const team: Team = {
        code: 'rdgs',
        members: 20,
      }
      ctx.body = {
        data: team,
      }
    },
    {
      description: 'Get all teams.',
      summary: 'Return all teams',
      responses: {
        [OasHttpCodes.OK]: {
          description: 'Awesome stuff',
          content: {
            'application/json': {
              schema: wrapJson(definitions.Team),
            },
          },
        },
      },
    }
  )
  .register(
    '/dead-teams',
    ['get'],
    ctx => {
      const team: DeadTeam = {
        code: 'rdgs',
        deadMembers: 20,
      }
      ctx.body = {
        data: team,
      }
    },
    {
      description: 'Get all teams.',
      summary: 'Return all teams',
      responses: {
        [OasHttpCodes.OK]: {
          description: 'Awesome stuff',
          content: {
            'application/json': {
              schema: wrapJson(definitions.DeadTeam),
            },
          },
        },
      },
    }
  )
  .get('/hello', () => {

  }, {
      description: 'Get all teams.',
      summary: 'Return all teams',
      responses: {
        [OasHttpCodes.OK]: {
          description: 'Awesome stuff',
          content: {
            'application/json': {
              schema: wrapJson(definitions.DeadTeam),
            },
          },
        },
      },
    })

const openApiJson = JSON.stringify(oas.getOasV3(), null, 2)
fs.writeFileSync('openApi.json', openApiJson)
