'use strict';

const aws = require('aws-sdk')
aws.config.update({ region: process.env.REGION });
const ec2 = new aws.EC2()
const tags = process.env.TAGS

//This was generated in the /jest/mockfunction/ folder using ec2 describe-instances on a live environment
const examples = require('./ec2-examples.json')


module.exports.skip = async (event, context) => {
  try {
    console.info(event)

    const value = event['state']

    console.info('Setting Skip Patching to: %s', value)

    var roles = tags.split(',')

    for (const tag of roles) {
      console.log(tag);
      const add_tag = `[{"Key": "Skip_Patching", "Value": ${value}}]`

      console.info(add_tag)

      var params = {
        Filters: [
          {
            'Name': 'tag:Role',
            'Values': [
              tag
            ]
          },
        ]
      };

      console.info(JSON.stringify(params))

      var instances = examples

      for (const instance of instances['Reservations']) {

        var instance_id = instance['Instances'][0]['InstanceId']

        var params = { Resources: [instance_id], Tags: add_tag }

        console.info('Created Tag on Instance ID: %s with Role: %s with Tag: %s', instance_id, tag, add_tag)
      }
    }

    return console.info('All Required Instances Has set Skip Patching To: %s', value)

  } catch (e) {
    return console.error('Failure Creating/Updating Skip Patching Tags: %s', e)
  }
};